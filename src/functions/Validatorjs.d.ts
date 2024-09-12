declare module 'validatorjs' {
    interface ValidatorOptions {
      [key: string]: any;
    }
  
    interface ValidationErrors {
      [key: string]: string[];
    }
  
    class Validator {
      constructor(data: object, rules: object, options?: ValidatorOptions);
  
      fails(): boolean;
      passes(): boolean;
      errors: {
        all(): ValidationErrors;
      };
    }
  
    export default Validator;
  }
  