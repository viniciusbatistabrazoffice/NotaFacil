package com.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;
    private final String from;
    private final String resetBaseUrl;
    private final boolean configured;

    public MailService(JavaMailSender mailSender,
            @Value("${spring.mail.username:}") String username,
            @Value("${app.mail.from:}") String mailFrom,
            @Value("${app.reset-password-url}") String resetBaseUrl) {
        this.mailSender = mailSender;
        this.from = StringUtils.hasText(mailFrom) ? mailFrom : username;
        this.resetBaseUrl = resetBaseUrl;
        this.configured = StringUtils.hasText(username);
    }

    public void sendPasswordReset(String toEmail, String token) {
        String link = resetBaseUrl + token;
        if (!configured || !StringUtils.hasText(toEmail)) {
            log.info("SMTP não configurado ou destinatário ausente. Link de redefinição para {}: {}", toEmail, link);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(toEmail);
        message.setSubject("NotaFácil - Redefinição de senha");
        message.setText("Recebemos uma solicitação para redefinir sua senha.\n\n"
                + "Acesse o link abaixo para criar uma nova senha (válido por tempo limitado):\n\n"
                + link + "\n\n"
                + "Se você não solicitou, ignore este e-mail.");
        mailSender.send(message);
    }
}
