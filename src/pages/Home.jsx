import React, { useState } from 'react';

function Home() {
  const [studentInput, setStudentInput] = useState('');
  const [pickCount, setPickCount] = useState(1);
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handlePick = () => {
    // 1. 입력된 명단 파싱
    let allStudents = studentInput
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (allStudents.length === 0) {
      alert('학생 명단을 입력해주세요!');
      return;
    }

    if (pickCount < 1 || pickCount > allStudents.length) {
      alert(`1명부터 ${allStudents.length}명 사이로 뽑아주세요!`);
      return;
    }

    let picked = [];
    let remainingStudents = [...allStudents];

    // 2. 관리자 비밀 명단 확인
    const secretListJson = localStorage.getItem('adminSecretList');
    if (secretListJson) {
      let secretList = JSON.parse(secretListJson);
      
      // 비밀 명단에 있는 학생이 전체 명단에도 있는지 확인 후 우선 추출
      for (let i = 0; i < secretList.length; i++) {
        const secretName = secretList[i];
        const indexInAll = remainingStudents.indexOf(secretName);
        if (indexInAll !== -1) {
          picked.push(secretName);
          remainingStudents.splice(indexInAll, 1); // 남은 목록에서 제거
        }
        if (picked.length >= pickCount) break;
      }
      
      // 뽑힌 사람은 비밀 명단에서 제거하고 다시 저장 (1회용)
      const updatedSecretList = secretList.filter(name => !picked.includes(name));
      localStorage.setItem('adminSecretList', JSON.stringify(updatedSecretList));
    }

    // 3. 남은 인원 랜덤 추출
    while (picked.length < pickCount && remainingStudents.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingStudents.length);
      picked.push(remainingStudents[randomIndex]);
      remainingStudents.splice(randomIndex, 1);
    }

    // 4. 결과 세팅 및 팝업 표시 (랜덤하게 섞어서 비밀 명단인거 모르게)
    setResults(picked.sort(() => Math.random() - 0.5));
    setShowPopup(true);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>🐾 두구두구 랜덤 뽑기 🐾</h1>
        
        <div className="input-group">
          <label htmlFor="students">학생 명단 (줄바꿈이나 쉼표로 구분해요)</label>
          <textarea 
            id="students" 
            placeholder="예: 철수, 영희, 민수&#13;&#10;지영&#13;&#10;동진" 
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="pickCount">몇 명을 뽑을까요?</label>
          <input 
            type="number" 
            id="pickCount" 
            min="1" 
            value={pickCount}
            onChange={(e) => setPickCount(Number(e.target.value))}
          />
        </div>

        <div className="button-container">
          <button onClick={handlePick}>🎲 뽑기 시작! 🎲</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 축하합니다! 🎉</h2>
            {results.length === 1 ? (
              <div className="result-name">{results[0]}</div>
            ) : (
              <div className="result-list">
                {results.map((name, idx) => (
                  <div 
                    key={idx} 
                    className="result-item" 
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
            <div className="close-btn">
              <button onClick={() => setShowPopup(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
