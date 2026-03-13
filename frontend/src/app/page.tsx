"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/analysis/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // 백엔드에서 보낸 에러 메시지가 있을 경우 모달로 표시
        if (response.status === 400 && data.error) {
          setModalContent({
            title: "문서 판별 알림",
            description: data.error + "\n\n" + (data.details || "")
          });
          setShowModal(true);
          return;
        }
        throw new Error(data.message || "서버 응답 오류가 발생했습니다.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748] relative">
      {/* Custom Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#fff5f5] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#f56565]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2d3748] text-center mb-2">{modalContent.title}</h3>
            <p className="text-[#718096] text-center mb-8 whitespace-pre-line leading-relaxed">
              {modalContent.description}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-4 bg-[#2c1a4c] text-white rounded-xl font-bold hover:bg-[#3d2666] transition-colors shadow-lg"
            >
              확인했습니다
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2c1a4c] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#2c1a4c]">AI-Lawyer</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-[#4a5568]">
          <a href="#" className="hover:text-[#2c1a4c]">홈</a>
          <a href="#" className="hover:text-[#2c1a4c]">분석 가이드</a>
          <a href="#" className="hover:text-[#2c1a4c]">전문가 연결</a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#2c1a4c] mb-4 tracking-tight">
            스마트 계약서 정밀 분석
          </h1>
          <p className="text-lg text-[#718096]">
            AI가 계약서의 숨겨진 위험 조항을 단 몇 초 만에 찾아냅니다.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#e2e8f0]">
          <div className="border-2 border-dashed border-[#cbd5e0] rounded-xl p-12 text-center hover:border-[#2c1a4c] transition-colors group">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-[#f7fafc] rounded-full flex items-center justify-center group-hover:bg-[#ebf4ff] transition-colors">
                  <svg className="w-8 h-8 text-[#4a5568] group-hover:text-[#2c1a4c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-semibold text-[#2d3748]">
                {file ? file.name : "계약서 파일을 여기에 드래그하거나 클릭하세요"}
              </p>
              <p className="text-sm text-[#a0aec0] mt-2">
                지원 형식: JPG, PNG, PDF (최대 10MB)
              </p>
            </label>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                loading || !file
                  ? "bg-[#cbd5e0] cursor-not-allowed"
                  : "bg-[#2c1a4c] text-white hover:bg-[#3d2666] hover:-translate-y-1 active:translate-y-0"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 분석 중...
                </span>
              ) : (
                "계약서 분석 시작하기"
              )}
            </button>
          </div>

          {error && !showModal && (
            <div className="mt-6 p-4 bg-[#fff5f5] border border-[#feb2b2] rounded-lg text-[#c53030] text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Result Section (Minimalist) */}
        {result && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#2c1a4c] mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              분석 결과 리포트
            </h2>
            <div className="bg-[#1a202c] rounded-2xl p-6 overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#2d3748]">
                <span className="text-[#a0aec0] text-xs font-mono uppercase tracking-widest">Raw Data Output</span>
                <button 
                  onClick={() => setResult(null)}
                  className="text-[#718096] hover:text-white text-sm"
                >
                  닫기
                </button>
              </div>
              <pre className="text-green-400 font-mono text-sm overflow-x-auto p-4 bg-black/30 rounded-lg max-h-[500px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-[#e2e8f0] text-center text-[#a0aec0] text-sm">
        <p>© 2026 AI-Lawyer. All rights reserved.</p>
      </footer>
    </div>
  );
}
