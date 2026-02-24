import React, { useMemo, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Bio, skills, experiences, education, projects } from "../../data/constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;

  @media (max-width: 960px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 0px 0px 80px 0px;
  gap: 12px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};

  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 650px;
  color: ${({ theme }) => theme.text_secondary};

  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
`;

const Card = styled.div`
  width: 95%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card};
  padding: 28px;
  border-radius: 16px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  margin-top: 22px;
  gap: 12px;
`;

const CardTitle = styled.div`
  font-size: 22px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  resize: vertical;

  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: linear-gradient(225deg, hsla(120, 100%, 25%, 1) 0%, hsla(140, 100%, 30%, 1) 100%);
  padding: 13px 16px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

const SmallButton = styled.button`
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Output = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.text_secondary + "33"};
  border-radius: 12px;
  padding: 14px 16px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.55;
  white-space: pre-wrap;
`;

const Examples = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.button`
  border: 1px solid ${({ theme }) => theme.text_secondary + "66"};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Contact = () => {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [okOpen, setOkOpen] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("Something went wrong.");

  const outputRef = useRef(null);

  const context = useMemo(() => {
    return `
You are a helpful assistant for Lucas Krzysztow's portfolio website. You have access to the following information about Lucas:

BIO:
Name: ${Bio.name}
Roles: ${Bio.roles.join(", ")}
Description: ${Bio.description}
GitHub: ${Bio.github}
Resume: ${Bio.resume}

SKILLS:
${skills
  .map(
    (g) => `
${g.title}:
${g.skills.map((s) => `- ${s.name}`).join("\n")}
`
  )
  .join("\n")}

EXPERIENCE:
${experiences
  .map(
    (exp) => `
${exp.role} at ${exp.company} (${exp.date})
${exp.desc}
Skills: ${exp.skills.join(", ")}
`
  )
  .join("\n")}

EDUCATION:
${education
  .map(
    (edu) => `
${edu.degree} from ${edu.school} (${edu.date})
${edu.desc}
Grade: ${edu.grade}
`
  )
  .join("\n")}

PROJECTS:
${projects
  .slice(0, 6)
  .map(
    (p) => `
${p.title} (${p.date})
${p.description}
Tags: ${p.tags.join(", ")}
`
  )
  .join("\n")}

Instructions:
- Answer questions based ONLY on the info above.
- Keep responses concise, friendly, and professional.
- If something isn't in the data, say you don't have that information.
`.trim();
  }, []);

  useEffect(() => {
    if (answer && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [answer]);

  const askAI = async () => {
    const userText = prompt.trim();
    if (!userText || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          context,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      const reply = typeof data?.reply === "string" ? data.reply : "";
      setAnswer(reply || "I couldn’t generate a response. Try a different question.");
      setOkOpen(true);
    } catch (e) {
      console.error(e);
      setErrMsg("AI assistant failed to respond. Please try again.");
      setErrOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setPrompt("");
    setAnswer("");
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      askAI();
    }
  };

  const examplePrompts = [
    "What tech skills does Lucas have?",
    "Summarize Lucas’s work experience.",
    "What are Lucas’s top projects and what did he build?",
    "What is Lucas studying and when does he graduate?",
    "What kind of roles is Lucas looking for?",
  ];

  return (
    <Container>
      <Wrapper>
        <Title>Ask Lucas (AI)</Title>
        <Desc>
          Ask a question about Lucas’s background, skills, experience, education, or projects. This assistant responds based
          on the portfolio information.
          <br />
          Tip: Press <b>Ctrl+Enter</b> to send.
        </Desc>

        <Card>
          <CardTitle>Ask a question</CardTitle>

          <Examples>
            {examplePrompts.map((t) => (
              <Chip
                key={t}
                type="button"
                onClick={() => setPrompt(t)}
                disabled={loading}
                title="Use this prompt"
              >
                {t}
              </Chip>
            ))}
          </Examples>

          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: What projects has Lucas built with React or Python?"
            disabled={loading}
          />

          <InputRow>
            <SmallButton type="button" onClick={clearAll} disabled={loading && !prompt && !answer}>
              Clear
            </SmallButton>

            <Button type="button" onClick={askAI} disabled={loading || !prompt.trim()}>
              {loading ? "Thinking..." : "Ask AI"}
            </Button>
          </InputRow>

          {answer && (
            <div ref={outputRef}>
              <CardTitle style={{ marginTop: 6 }}>Answer</CardTitle>
              <Output>{answer}</Output>
            </div>
          )}
        </Card>

        <Snackbar
          open={okOpen}
          autoHideDuration={2500}
          onClose={() => setOkOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setOkOpen(false)} severity="success" sx={{ width: "100%" }}>
            Response received.
          </Alert>
        </Snackbar>

        <Snackbar
          open={errOpen}
          autoHideDuration={6000}
          onClose={() => setErrOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setErrOpen(false)} severity="error" sx={{ width: "100%" }}>
            {errMsg}
          </Alert>
        </Snackbar>
      </Wrapper>
    </Container>
  );
};

export default Contact;