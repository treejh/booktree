plugins {
    java
    id("org.springframework.boot") version "3.4.4"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    implementation("org.springframework.boot:spring-boot-starter-validation")

    //데이터 베이스 관련 의존성
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("com.h2database:h2")
    runtimeOnly("com.mysql:mysql-connector-j")

    //swagger 의존성
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.5")


    implementation ("org.springframework.boot:spring-boot-starter-validation")




    implementation ("org.springframework.boot:spring-boot-starter-security")
    implementation ("com.auth0:java-jwt:4.4.0")

    implementation ("mysql:mysql-connector-java:8.0.33")




}

tasks.withType<Test> {
    useJUnitPlatform()
}
