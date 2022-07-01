import styled from "styled-components";
import PrideText from "../../themes/PrideText";

const StyledTextArea = styled.textarea`
width: 90vw;
height: 25vh;
max-width: 600px;
min-height: 100px;
background:  ${(props) => props.theme.backgroundColor};
color:  ${(props) => props.theme.primaryFontColor};
border-color:  ${(props) => props.theme.borderColor};
margin-left: 1px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
`;

export default function Contact(){

    const onClick = (e) => {
      if (e.target.value === ""){
        e.preventDefault();
        return;
      }

        if (process.env.NODE_ENV === "development"){
            e.preventDefault();
            alert('This click doesn\'t do anything in development mode since it only works with Netlify');
         }
    }

    return (
        <div> 
            <h1><PrideText text="Contact Me"/></h1>    
            <p>It's always nice to hear from users.  Maybe you have a feature request or even just want to say hi! If you would like a response be sure to include some kind of contact information in the message.</p>
            <form name="contact" method="post">
        <input type="hidden" name="form-name" value="contact" />
        <p>
          <StyledLabel>Message: <StyledTextArea name="message"></StyledTextArea></StyledLabel>
        </p>
        <p>
          <button onClick={onClick}type="submit">Send</button>
        </p>
      </form>
        </div>
        
    )
}