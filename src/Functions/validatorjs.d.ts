declare module 'validatorjs' {
    interface Validator {
      new (data: any, rules: any, customErrorMessages?: any): Validator;
      passes(): boolean;
      fails(): boolean;
      errors: {
        first(attribute: string): string | false;
        get(attribute: string): string[];
        all(): { [key: string]: string[] };
        has(attribute: string): boolean;
        errorCount: number;
      };
      setAttributeNames(names: { [key: string]: string }): void;
    }
    
    const Validator: Validator;
    export default Validator;
  }
  