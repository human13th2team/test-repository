package com.ailawyer.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AnalysisResponseDto {

    private boolean isContract;
    private String documentType; // 계약서 종류 (예: 근로계약서)
    private String language;     // 원문 언어
    private String anonymizedText; // 비식별화된 텍스트
    private int score;           // 신뢰도/안전성 스코어 (0-100)
    
    private List<ClauseAnalysis> riskClauses; // 독소 조항 분석 결과
    
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class ClauseAnalysis {
        private String originalClause;  // 원문 조항
        private String riskLevel;        // 위험도 (LOW, MEDIUM, HIGH)
        private String explanation;      // 분석 해설
        private String improvement;      // 수정 제안 (협상 스크립트)
    }
}
