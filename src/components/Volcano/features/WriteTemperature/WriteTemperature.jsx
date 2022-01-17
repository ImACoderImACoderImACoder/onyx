import styled from "styled-components";

const Button = styled.button`
  font-size: x-large;
  min-height: 35px;
  flex-grow: 1;
  background-color: ${(props) => props.theme.buttonColorMain};
  color: darkgray;
  border-radius: 15px;
  border-color: darkgray;
`;

function WriteTemperature(props) {
  return (
    <div className="temperature-write-button-div">
      <Button
        className={`temperature-write-button ${props.className}`}
        onClick={props.onClick}
      >
        {props.buttonText}
      </Button>
    </div>
  );
}

export default WriteTemperature;
