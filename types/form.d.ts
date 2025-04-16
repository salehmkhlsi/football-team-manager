import { ReactNode } from "react";

// Define basic type for form field
export interface FormFieldType {
  onChange: (value: any) => void;
  onBlur: () => void;
  value: any;
  name: string;
  ref?: React.Ref<any>;
}
