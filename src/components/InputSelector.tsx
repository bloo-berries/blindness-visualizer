import React, { useRef } from 'react';
import { InputSource } from '../App';

interface InputSelectorProps {
  currentSource: InputSource;
  onSourceChange: (source: InputSource) => void;
}

const InputSelector: React.FC<InputSelectorProps> = ({ currentSource, onSourceChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const youtubeInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onSourceChange({ type: 'image', url: imageUrl });
    }
  };

  const handleYoutubeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const youtubeUrl = youtubeInputRef.current?.value;
    if (youtubeUrl) {
      onSourceChange({ type: 'youtube', url: youtubeUrl });
    }
  };

  return (
    <div className="input-selector">
      <div className="source-buttons">
        <button
          className={currentSource.type === 'webcam' ? 'active' : ''}
          onClick={() => onSourceChange({ type: 'webcam' })}
        >
          Webcam
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>

      <form onSubmit={handleYoutubeSubmit} className="youtube-input">
        <input
          type="text"
          ref={youtubeInputRef}
          placeholder="Enter YouTube URL"
        />
        <button type="submit">Load YouTube Video</button>
      </form>
    </div>
  );
};

export default InputSelector; 