import React from "react";
import { MessageCircle } from "react-feather";
import './ChatButton.css';

interface ChatButtonProps {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  left?: Boolean
}

function ChatButton(props: ChatButtonProps) {
  return (
    <div className={`chat-button ${props.left? 'left': ''}`} onClick={props.onClick}>
      <MessageCircle color='white' />
    </div>
  );
}

export default ChatButton;