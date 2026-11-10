package com.unklab.plagiarism;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlagiarismCheckerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlagiarismCheckerApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 UNKLAB Plagiarism Checker Backend Running!");
        System.out.println("📡 API URL: http://localhost:8080/api/health");
        System.out.println("🗄️ H2 Console: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
