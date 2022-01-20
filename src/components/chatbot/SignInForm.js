import React,{Component} from 'react';
import { FormControl } from '@material-ui/core';

export class SignInForm extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
                         
        }
    }
    
    render() {
        return (
            <div>
                <FormControl>
                <InputLabel htmlFor="my-input">Email address</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
                <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                </FormControl>                                
            </div>
        )
    }
}

export default SignInForm
