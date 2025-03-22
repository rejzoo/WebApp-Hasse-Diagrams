package com.hassediagrams.rejzo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HassediagramsBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(HassediagramsBeApplication.class, args);
	}

}
