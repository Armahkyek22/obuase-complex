// Validation utilities for form inputs and data

export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    // Ghanaian phone number validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Ghanaian phone number patterns:
    // +233XXXXXXXXX (international format)
    // 233XXXXXXXXX (without +)
    // 0XXXXXXXXX (local format)
    // XXXXXXXXX (without leading 0)
    
    const ghanaianPatterns = [
      /^\+233[2-9]\d{8}$/, // +233XXXXXXXXX (international with +)
      /^233[2-9]\d{8}$/,   // 233XXXXXXXXX (international without +)
      /^0[2-9]\d{8}$/,     // 0XXXXXXXXX (local format)
      /^[2-9]\d{8}$/,      // XXXXXXXXX (9 digits starting with 2-9)
    ];
    
    return ghanaianPatterns.some(pattern => pattern.test(cleanPhone));
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

export const sanitize = {
  email: (email: string): string => {
    return email.toLowerCase().trim();
  },

  phone: (phone: string): string => {
    // Clean and normalize Ghanaian phone numbers
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Convert local format to international format for consistency
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '233' + cleaned.substring(1);
    }
    
    return cleaned;
  },

  name: (name: string): string => {
    return name.trim().replace(/\s+/g, ' ');
  },
};

// Individual validation functions for easier import
export const validateEmail = (email: string): boolean => {
  return validation.email(email);
};

export const validatePhone = (phone: string): boolean => {
  return validation.phone(phone);
};

// Specific Ghanaian phone validation with detailed feedback
export const validateGhanaianPhone = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: true }; // Phone is optional
  }

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.length < 9) {
    return { isValid: false, message: 'Phone number is too short' };
  }
  
  if (cleanPhone.length > 13) {
    return { isValid: false, message: 'Phone number is too long' };
  }
  
  const isValid = validation.phone(phone);
  if (!isValid) {
    return { 
      isValid: false, 
      message: 'Please enter a valid Ghanaian phone number (e.g., 0241234567, +233241234567)' 
    };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): boolean => {
  // For login, we just check minimum length
  return password.length >= 6;
};

export const validateRequired = (value: string): boolean => {
  return validation.required(value);
};

export const formatters = {
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Format Ghanaian phone numbers
    if (cleaned.startsWith('233') && cleaned.length === 12) {
      // +233 XX XXX XXXX
      const match = cleaned.match(/^(233)(\d{2})(\d{3})(\d{4})$/);
      if (match) {
        return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
      }
    } else if (cleaned.startsWith('0') && cleaned.length === 10) {
      // 0XX XXX XXXX
      const match = cleaned.match(/^(0\d{2})(\d{3})(\d{4})$/);
      if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
      }
    } else if (cleaned.length === 9) {
      // XXX XXX XXX
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
      if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
      }
    }
    
    return phone;
  },

  date: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString();
  },

  time: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  percentage: (value: number): string => {
    return `${Math.round(value)}%`;
  },

  grade: (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  },
};