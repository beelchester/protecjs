declare module 'protecjs' {
    
    export interface TextInputProps {
      value: string;
      onChange: (value: string) => void;
      dompurify?: {
        ALLOWED_TAGS?: string[];
        ALLOWED_ATTR?: string[];
        FORBID_TAGS?: string[];
        FORBID_ATTR?: string[];
      };
    }
  
    export const TextInput: React.FC<TextInputProps>;
    export function validation(input: string): void;
  }
  
