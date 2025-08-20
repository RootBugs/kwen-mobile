import { MAX_CAPTION_LENGTH, MAX_MESSAGE_LENGTH, MAX_BIO_LENGTH } from '@/lib/constants';

export function validateCaption(caption: string): { valid: boolean; error?: string } {
  if (caption.length > MAX_CAPTION_LENGTH) {
    return { valid: false, error: `Caption must be ${MAX_CAPTION_LENGTH} characters or less` };
  }
  return { valid: true };
}

export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (message.length > MAX_MESSAGE_LENGTH) {

    return { valid: false, error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` };
  }
  return { valid: true };

}

export function validateBio(bio: string): { valid: boolean; error?: string } {
  if (bio.length > MAX_BIO_LENGTH) {
    return { valid: false, error: `Bio must be ${MAX_BIO_LENGTH} characters or less` };
  }
  return { valid: true };
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 30) {
    return { valid: false, error: 'Username must be 30 characters or less' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true };
}
