export const KYC_STATUS = ['pending', 'approved', 'rejected'] as const;

export type TKycStatus = (typeof KYC_STATUS)[number];

export const KYC_DOCUMENT_TYPES = ['nid', 'passport', 'driving-license'] as const;

export type TKycDocumentType = (typeof KYC_DOCUMENT_TYPES)[number];

export const MAX_KYC_FILE_BYTES = 3 * 1024 * 1024;
