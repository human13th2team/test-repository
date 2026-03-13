package com.ailawyer.backend.ai.service;

import com.ailawyer.backend.ai.dto.AnalysisResponseDto;
import dev.langchain4j.data.image.Image;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.PostConstruct;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AiAnalysisService {

    @Value("${google.ai.api.key}")
    private String apiKey;

    private final AnalysisContextManager contextManager;
    private AiLegalAssistant assistant;

    public AiAnalysisService(AnalysisContextManager contextManager) {
        this.contextManager = contextManager;
    }

    @PostConstruct
    public void init() {
        try {
            log.info("Gemini 모델 초기화 중... API Key: {}***", apiKey.substring(0, 5));
            // Google AI Studio (Gemini) 모델 설정
            GoogleAiGeminiChatModel model = GoogleAiGeminiChatModel.builder()
                    .apiKey(apiKey)
                    .modelName("gemini-2.5-flash") // 원래 사용하던 모델명으로 복구
                    .logRequestsAndResponses(true)
                    .build();

            ContentRetriever contentRetriever = query -> java.util.Collections.emptyList();

            this.assistant = AiServices.builder(AiLegalAssistant.class)
                    .chatLanguageModel(model)
                    .contentRetriever(contentRetriever)
                    .build();
            log.info("Gemini 모델 초기화 완료");
        } catch (Exception e) {
            log.error("Gemini 모델 초기화 실패: {}", e.getMessage(), e);
        }
    }

    public AnalysisResponseDto analyze(String extractedText) {
        log.info("Gemini 분석 요청 (텍스트 길이: {})", extractedText.length());
        try {
            return assistant.analyzeContract(extractedText);
        } catch (Exception e) {
            log.error("Gemini 분석 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
    }

    public AnalysisResponseDto analyzeImage(byte[] imageBytes, String mimeType) {
        log.info("Gemini 이미지 분석 요청 (MimeType: {})", mimeType);
        try {
            Image image = Image.builder()
                    .base64Data(Base64.getEncoder().encodeToString(imageBytes))
                    .mimeType(mimeType)
                    .build();

            return assistant.analyzeContractImage(image);
        } catch (Exception e) {
            log.error("Gemini 이미지 분석 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
    }

    public String ask(String question) {
        String context = contextManager.getContext("default");
        return assistant.answerLegalQuestion(context, question);
    }
}
