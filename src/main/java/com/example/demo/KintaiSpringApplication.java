package com.example.demo;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class KintaiSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(KintaiSpringApplication.class, args);
	}

	/**
	 * ModelMapperをSpring Bootで使えるようにBean化
	 */
	@Bean
	ModelMapper modelMapper() {
		return new ModelMapper();
	}
}
