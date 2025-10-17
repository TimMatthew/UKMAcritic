package org.spring.ukmacritic;

import jakarta.annotation.PreDestroy;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class UkmacriticApplication implements CommandLineRunner {

    private Process fastApiProcess;

    public static void main(String[] args) {
        SpringApplication.run(UkmacriticApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        startFastApiService();
        Runtime.getRuntime().addShutdownHook(new Thread(this::stopFastApiService));
    }

    private void startFastApiService() {
        try {
            ProcessBuilder pb = new ProcessBuilder("app.exe");
            pb.redirectErrorStream(true);
            fastApiProcess = pb.start();
            System.out.println("FastAPI service started.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @PreDestroy
    private void stopFastApiService() {
        if (fastApiProcess != null && fastApiProcess.isAlive()) {
            fastApiProcess.destroy();
            System.out.println("FastAPI service stopped.");
        }
    }
}
