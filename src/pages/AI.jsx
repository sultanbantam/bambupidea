import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bot, Send, User, LockKeyhole } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { bambooSpecies } from '../utils/bambooData';

// Dynamically construct the database string so the AI never guesses the scientific names
const ID_BAMBOO_DB = bambooSpecies['INDONESIA'].map(b => `"${b.common}" (Scientific name: ${b.scientific})`).join(' | ');

const SYSTEM_PROMPT = `You are an elite Botanist and Architectural Consultant for BambuPIdea. 
Your goal is to provide highly precise, accurate, and scientific information regarding bamboo cultivation, ecology, and bamboo architecture.
CRITICAL BOTANICAL KNOWLEDGE - NEVER GUESS SCIENTIFIC NAMES. You MUST EXACTLY match these local Indonesian names to their true scientific names:
[ ${ID_BAMBOO_DB} ]
Key constraints: 
1. If estimating for a 100m² house, state that it typically requires 200-250 poles of Giant Bamboo (Bambu Petung) for the main structure, and ~400 poles of smaller bamboo (Bambu Apus) for walls and roofing. 
2. ALWAYS use the exact scientific mappings provided above. Example: Never say Bambusa blumeana is Bambu Petung (It is Bambu Ori).
3. Do not use extremely long filler introductions. Be professional and concise.`;

function AI() {
  const { currentUser, deductQuota, buyAiQuota } = useContext(AppContext);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your BambuPIdea AI expert powered by Groq Llama 3.3. How can I assist you with precise architectural estimations or ecological bamboo advice today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessingPi, setIsProcessingPi] = useState(false);
  
  // Custom API Key state
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '');
  const [isConfiguringKey, setIsConfiguringKey] = useState(!localStorage.getItem('groq_api_key'));
  const [tempKey, setTempKey] = useState('');

  const endOfMessagesRef = useRef(null);
  const quota = currentUser.ai_quota !== undefined ? currentUser.ai_quota : 3;

  const saveApiKey = (e) => {
    e.preventDefault();
    if(tempKey.trim().startsWith('gsk_')) {
      localStorage.setItem('groq_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setIsConfiguringKey(false);
    } else {
      alert("Invalid Groq API Key. Must start with 'gsk_'");
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const PI_DESTINATION = "GDAUMSAJ2RYIHXIMUIRMVX3ZWPE7Z34AITHNK47OXCN4CFYU42URXBSM";

  const handlePiPayment = () => {
    setIsProcessingPi(true);
    // Simulate Blockchain TX Delay
    setTimeout(() => {
      buyAiQuota(PI_DESTINATION);
      setIsProcessingPi(false);
    }, 2000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    if(quota <= 0) return;

    // Deduct exact usage from backend state
    deductQuota();

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    if (!apiKey) {
      setIsConfiguringKey(true);
      setIsTyping(false);
      return;
    }

    try {
      // Map only valid roles to Groq payload
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: apiMessages,
          temperature: 0.2, // Low temp for logical precision
          max_completion_tokens: 1024,
        })
      });

      if(!response.ok) {
        throw new Error(`API Request Failed: ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error("AI Fetch Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Failed to fetch response (${error.message}). Please check your internet connection and verify that your API key is correct.` }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to render newlines natively without an external markdown library dependency
  const renderText = (str) => {
    return str.split('\\n').map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (isConfiguringKey) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center' }}>
        <Bot size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
        <h2>Setup Groq API</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>To protect your security on public hosting like GitHub, please enter your Groq Llama 3 API Key manually below. It will be saved securely in your browser's local storage.</p>
        <form onSubmit={saveApiKey} style={{ width: '100%', maxWidth: '400px' }}>
          <div className="input-group">
            <input 
              type="password" 
              className="input" 
              value={tempKey} 
              onChange={e => setTempKey(e.target.value)} 
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxx" 
              required
            />
          </div>
          <button type="submit" className="btn">Save & Activate AI</button>
        </form>
        <button onClick={() => { localStorage.removeItem('groq_api_key'); setApiKey(''); setIsConfiguringKey(true); }} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', textDecoration: 'underline', cursor: 'pointer' }}>Erase Current Key</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '0.25rem', flexShrink: 0 }}>AI Architect Desk</h2>
        <button onClick={() => setIsConfiguringKey(true)} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Config API</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-primary)' }}>Powered by Groq Llama 3.3</p>
        <div style={{ fontSize: '0.875rem', fontWeight: 'bold', backgroundColor: 'var(--color-bg)', padding: '0.25rem 0.5rem', borderRadius: '1rem', color: quota > 0 ? 'var(--color-primary)' : '#ea580c' }}>
          Free Queries: {quota}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            display: 'flex', 
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div style={{ 
              backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-card)',
              color: msg.role === 'user' ? 'white' : 'var(--color-primary)',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div style={{ 
              backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-card)',
              color: msg.role === 'user' ? 'white' : 'var(--color-text)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              borderTopLeftRadius: msg.role === 'assistant' ? '0' : 'var(--radius-lg)',
              borderTopRightRadius: msg.role === 'user' ? '0' : 'var(--radius-lg)',
              maxWidth: '85%',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              {renderText(msg.content)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
             <div style={{ 
              backgroundColor: 'var(--color-card)', color: 'var(--color-primary)',
              padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Bot size={20} />
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
              Groq is calculating precision algorithms...
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {quota <= 0 ? (
        <div style={{ textAlign: 'center', padding: '1rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 'var(--radius-md)', marginTop: '0.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LockKeyhole size={24} color="#d97706" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ margin: '0 0 0.25rem 0', color: '#b45309' }}>Access Restricted</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#92400e' }}>You have hit the 3 queries limit. Unlock 10 more queries utilizing your PI balance!</p>
          
          <div style={{ width: '100%', padding: '0.75rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.7rem', textAlign: 'left', wordBreak: 'break-all', color: '#b45309' }}>
             <strong style={{display: 'block', marginBottom: '0.25rem'}}>Destination Wallet:</strong>
             {PI_DESTINATION}
          </div>

          <button onClick={handlePiPayment} disabled={isProcessingPi} className="btn" style={{ background: '#f59e0b', color: 'white', maxWidth: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: isProcessingPi ? 0.7 : 1 }}>
            {isProcessingPi ? 'Processing Web3 TX...' : (
              <>
                <span style={{ fontWeight: 'bold', borderRight: '1px solid white', paddingRight: '0.5rem', marginRight: '0.5rem' }}>π 1</span> 
                Transfer PI
              </>
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexShrink: 0 }}>
          <input 
            type="text" 
            className="input" 
            style={{ flex: 1, borderRadius: '2rem' }} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Calculate poles for 150m2 house..."
            disabled={isTyping}
          />
          <button type="submit" className="btn" disabled={isTyping} style={{ width: 'auto', borderRadius: '50%', padding: '0.75rem', opacity: isTyping ? 0.7 : 1 }}>
            <Send size={20} />
          </button>
        </form>
      )}
    </div>
  );
}

export default AI;
