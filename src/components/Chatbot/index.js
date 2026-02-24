import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Bio, skills, experiences, education, projects } from '../../data/constants';

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: ${({ theme }) => theme.card};
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 2px solid ${({ theme }) => theme.primary};
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;

  &.user {
    background: ${({ theme }) => theme.primary};
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  }

  &.bot {
    background: ${({ theme }) => theme.bgLight};
    color: ${({ theme }) => theme.text_primary};
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  }
`;

const ChatInputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  display: flex;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SendButton = styled.button`
  padding: 10px 15px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primary + 'CC'};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  z-index: 1001;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_secondary};
  border-radius: 18px;
  border-bottom-left-radius: 5px;
  align-self: flex-start;
  font-size: 12px;
  font-style: italic;
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  background: ${({ theme }) => theme.text_secondary};
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;

  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text:
        "Hi! I'm your portfolio assistant. I can help answer questions about Lucas's background, skills, experience, education, and projects. What would you like to know?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createContextPrompt = () => {
    return `
You are a helpful assistant for Lucas Krzysztow's portfolio website. You have access to the following information about Lucas:

BIO:
Name: ${Bio.name}
Roles: ${Bio.roles.join(', ')}
Description: ${Bio.description}
GitHub: ${Bio.github}
Resume: ${Bio.resume}

SKILLS:
${skills
  .map(
    (skillGroup) => `
${skillGroup.title}:
${skillGroup.skills.map((skill) => `- ${skill.name}`).join('\n')}
`
  )
  .join('\n')}

EXPERIENCE:
${experiences
  .map(
    (exp) => `
${exp.role} at ${exp.company} (${exp.date})
${exp.desc}
Skills: ${exp.skills.join(', ')}
`
  )
  .join('\n')}

EDUCATION:
${education
  .map(
    (edu) => `
${edu.degree} from ${edu.school} (${edu.date})
${edu.desc}
Grade: ${edu.grade}
`
  )
  .join('\n')}

PROJECTS:
${projects
  .slice(0, 5)
  .map(
    (project) => `
${project.title} (${project.date})
${project.description}
Tags: ${project.tags.join(', ')}
`
  )
  .join('\n')}

Please answer questions about this information in a friendly, professional manner.
Keep responses concise but informative.
If asked about something not in this data, politely say you don't have that information.
`.trim();
  };

  const sendMessage = async () => {
    const userText = input;
    if (!userText.trim() || isTyping) return;

    const userMessage = { text: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: createContextPrompt(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const botReply =
        typeof data?.reply === 'string' && data.reply.trim()
          ? data.reply
          : "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: 'bot',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) {
    return <ToggleButton onClick={() => setIsOpen(true)}>💬</ToggleButton>;
  }

  return (
    <ChatbotContainer>
      <ChatHeader>
        Portfolio Assistant
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
          }}
          aria-label="Close chat"
        >
          ×
        </button>
      </ChatHeader>

      <ChatMessages>
        {messages.map((message, index) => (
          <Message key={index} className={message.sender}>
            {message.text}
          </Message>
        ))}

        {isTyping && (
          <TypingIndicator>
            Lucas is typing
            <Dot />
            <Dot />
            <Dot />
          </TypingIndicator>
        )}

        <div ref={messagesEndRef} />
      </ChatMessages>

      <ChatInputContainer>
        <ChatInput
          type="text"
          placeholder="Ask about Lucas's background..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
        />
        <SendButton onClick={sendMessage} disabled={isTyping || !input.trim()}>
          ➤
        </SendButton>
      </ChatInputContainer>
    </ChatbotContainer>
  );
};

export default Chatbot;