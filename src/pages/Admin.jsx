import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [secretInput, setSecretInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('adminSecretList');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        setSecretInput(list.join(', '));
      } catch(e) {}
    }
  }, []);

  const handleSave = () => {
    const list = secretInput
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    localStorage.setItem('adminSecretList', JSON.stringify(list));
    alert('비밀 명단이 저장되었습니다! (학생들 모르게 메인으로 이동할게요)');
    navigate('/');
  };

  const handleClear = () => {
    localStorage.removeItem('adminSecretList');
    setSecretInput('');
    alert('비밀 명단이 초기화되었습니다.');
  };

  return (
    <div className="app-container">
      <div className="card" style={{ borderColor: '#ff7f50' }}>
        <h1 style={{ color: '#ff7f50' }}>🤫 선생님 전용 비밀 설정 🤫</h1>
        
        <div className="input-group">
          <label htmlFor="secrets" style={{ color: '#ff7f50' }}>
            다음에 무조건 뽑힐 학생 이름을 순서대로 적어주세요. (줄바꿈이나 쉼표로 구분)
          </label>
          <textarea 
            id="secrets" 
            placeholder="예: 철수, 영희" 
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            style={{ borderColor: '#ff7f50' }}
          />
        </div>

        <div className="button-container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={handleSave} 
            style={{ backgroundColor: '#32cd32', boxShadow: '0 5px 0 #228b22' }}
          >
            💾 저장하기
          </button>
          <button 
            className="danger" 
            onClick={handleClear}
          >
            🗑 초기화
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={{ backgroundColor: '#a9a9a9', boxShadow: '0 5px 0 #808080' }}
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
