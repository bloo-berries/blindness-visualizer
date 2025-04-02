const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/ConditionPreview.tsx');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Find the positions of the functions
const getBlendModePos = content.indexOf('const getBlendMode');
const getLayerPriorityPos = content.indexOf('const getLayerPriority');
const getRenderStylesPos = content.indexOf('const getRenderStyles');

const getBlendModeEndPos = findEndOfFunction(content, getBlendModePos);
const getLayerPriorityEndPos = findEndOfFunction(content, getLayerPriorityPos);

// Extract the functions as strings
const getBlendModeFunc = content.substring(getBlendModePos, getBlendModeEndPos);
const getLayerPriorityFunc = content.substring(getLayerPriorityPos, getLayerPriorityEndPos);

// Remove the functions from their original positions
const contentWithoutFuncs = content.slice(0, getBlendModePos) + content.slice(getBlendModeEndPos, getLayerPriorityPos) + content.slice(getLayerPriorityEndPos);

// Insert the functions before getRenderStyles
const posToInsert = contentWithoutFuncs.indexOf('const getRenderStyles');
const updatedContent = contentWithoutFuncs.slice(0, posToInsert) + getBlendModeFunc + '

  ' + getLayerPriorityFunc + '

  ' + contentWithoutFuncs.slice(posToInsert);

// Write the updated content back to the file
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully moved the getBlendMode and getLayerPriority functions before getRenderStyles.');
