

import multer from 'multer';

export const documentUploadMiddleware = multer({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'text/plain',
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    'Invalid file type. Only PDF and TXT files are allowed.',
                ),
            );
        }
    },
});