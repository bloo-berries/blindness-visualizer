import React from 'react';

export interface ConditionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  conditions: Array<{
    id: string;
    name: string;
    description: string;
    relatedPeople?: string[];
    imagePath?: string;
    treatments?: {
      available: boolean;
      options: string[];
      notes?: string;
    };
  }>;
}

export const PUBLIC_URL = process.env.PUBLIC_URL || '';
