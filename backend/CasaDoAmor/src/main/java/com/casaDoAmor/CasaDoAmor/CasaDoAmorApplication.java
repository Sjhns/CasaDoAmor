package com.casaDoAmor.CasaDoAmor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CasaDoAmorApplication {

	public static void main(String[] args) {
		SpringApplication.run(CasaDoAmorApplication.class, args);
	}

}
