import * as core from '@actions/core';
import * as glob from '@actions/glob';
import * as path from 'path';
import * as fs from 'fs';
import { ChildProcess, spawn } from 'child_process';
import { launchBrowser, closeBrowser, renderScreenshot, RenderResult } from './renderer';
import { createComposite, CompositeResult } from './composite';
import { postPRComment, createCheckRun, writeStepSummary } from './github';

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Server not ready yet
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function run(): Promise<void> {
  let serverProcess: ChildProcess | null = null;

  try {
    // Parse inputs
    const imagesGlob = core.getInput('images', { required: true });
    const conditionsRaw = core.getInput('conditions') || 'protanopia,deuteranopia,tritanopia,glaucoma,cataracts';
    const conditions = conditionsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const intensity = parseFloat(core.getInput('intensity') || '0.8');
    const shouldComment = core.getBooleanInput('comment');
    const shouldCheck = core.getBooleanInput('check');
    const maxRenders = parseInt(core.getInput('max-renders') || '12', 10);
    const token = core.getInput('github-token');

    // Expand image glob
    const globber = await glob.create(imagesGlob);
    const imagePaths = await globber.glob();

    if (imagePaths.length === 0) {
      core.warning('No images matched the glob pattern. Nothing to render.');
      return;
    }

    core.info(`Found ${imagePaths.length} image(s) to process.`);
    core.info(`Conditions: ${conditions.join(', ')}`);
    core.info(`Intensity: ${intensity}`);

    // Start static file server
    const baseUrl = 'http://localhost:3000';
    core.info('Starting static file server...');
    serverProcess = spawn('serve', ['-s', '/app/build', '-l', '3000'], {
      stdio: 'pipe',
    });
    await waitForServer(baseUrl);
    core.info('Server is ready.');

    // Launch browser
    await launchBrowser();

    // Create output directory
    const outputDir = path.join(process.cwd(), '.visionsim-output');
    fs.mkdirSync(outputDir, { recursive: true });

    // Render screenshots
    let renderCount = 0;
    const allComposites: CompositeResult[] = [];

    for (const imagePath of imagePaths) {
      if (renderCount >= maxRenders) {
        core.warning(`Reached max-renders cap (${maxRenders}). Stopping.`);
        break;
      }

      core.info(`Processing: ${path.basename(imagePath)}`);

      const renders: RenderResult[] = [];

      // Render original (no conditions)
      const original = await renderScreenshot(imagePath, '', {
        baseUrl, outputDir, intensity,
      });
      renders.push(original);
      renderCount++;

      // Render each condition
      for (const condition of conditions) {
        if (renderCount >= maxRenders) break;

        const result = await renderScreenshot(imagePath, condition, {
          baseUrl, outputDir, intensity,
        });
        renders.push(result);
        renderCount++;
      }

      // Create composite grid
      const composite = await createComposite(
        imagePath,
        renders.map(r => ({ condition: r.condition, screenshotPath: r.screenshotPath })),
        outputDir,
      );
      allComposites.push(composite);
    }

    core.info(`Rendered ${renderCount} screenshot(s), created ${allComposites.length} composite(s).`);

    // Set output
    core.setOutput('composites', JSON.stringify(allComposites.map(c => c.path)));

    // Post to GitHub
    if (shouldComment && token) {
      core.info('Posting PR comment...');
      await postPRComment(token, allComposites);
    }

    if (shouldCheck && token) {
      core.info('Creating check run...');
      await createCheckRun(token, allComposites);
    }

    // Always write to step summary so results are visible on push events too
    await writeStepSummary(allComposites);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  } finally {
    await closeBrowser();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

run();
