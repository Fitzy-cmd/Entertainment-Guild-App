import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

export default function FilterCheckbox1({ label, name, checked, onChange }) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                    name={name}
                />
            }
            label={label}
        />
    );
}