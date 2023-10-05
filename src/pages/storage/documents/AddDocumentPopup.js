import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from '../documents/AddDocumentPopup.module.css';

const AddDocumentPopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDrop = (e, attachmentType) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    console.log(`Dropped ${attachmentType} files:`, files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const { getRootProps, getInputProps } = useDropzone();

  return (
    <>
      {isOpen && (
        <div className={styles.popup}>
          <div className={styles['popup-content']} onDragOver={handleDragOver}>
            <div className={styles['popup-header']}>
              <h2>Add Document</h2>
              <span className={styles['close-popup']} onClick={handleClose}>X</span>
            </div>
            <div className={styles['popup-body']}>
              <div className={styles['file-upload']} onDrop={(e) => handleDrop(e, 'Public')}>
                <div className={styles['drop-zone']} htmlFor="publicAttachment" {...getRootProps()}>
                  <input {...getInputProps()} />
                  Drop Public Attachment here or click to upload
                </div>
              </div>
              <div className={styles['file-upload']} onDrop={(e) => handleDrop(e, 'Private')}>
                <div className={styles['drop-zone']} htmlFor="privateAttachment" {...getRootProps()}>
                  <input {...getInputProps()} />
                  Drop Private Attachment here or click to upload
                </div>
              </div>
            </div>
            <div className={styles['popup-footer']}>
              <div className={styles['button-container']}>
                <button>Save</button>
                <button className={styles['close-popup']} onClick={handleClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDocumentPopup;
