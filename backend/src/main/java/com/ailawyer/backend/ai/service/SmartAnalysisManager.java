package com.ailawyer.backend.ai.service;

import com.ailawyer.backend.ai.dto.AnalysisResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmartAnalysisManager {

    private final DocumentParser documentParser;
    private final AiAnalysisService aiAnalysisService;

    /**
     * 전체 분석 프로세스를 관리합니다. (PDF 텍스트 추출 혹은 이미지 직접 분석)
     */
    public AnalysisResponseDto processAnalysis(MultipartFile file) throws IOException {
        log.info("파일 분석 시작: {}", file.getOriginalFilename());
        String contentType = Objects.requireNonNull(file.getContentType());

        if (contentType.equals("application/pdf")) {
            // 1. PDF인 경우 텍스트 추출 후 분석
            String rawText = documentParser.extractText(file);
            return aiAnalysisService.analyze(rawText);
        } else if (contentType.startsWith("image/")) {
            // 2. 이미지인 경우 Gemini Vision으로 직접 분석
            return aiAnalysisService.analyzeImage(file.getBytes(), contentType);
        } else {
            throw new IllegalArgumentException("지원하지 않는 파일 형식입니다: " + contentType);
        }
    }

    /**
     * 분석 리포트 기반 대화형 질의응답 (RAG)
     */
    public String askQuestion(String question) {
        return aiAnalysisService.ask(question);
    }
}
