$(document).ready(function() {
    $('#sendButton').click(function() {
        var userMessage = $('#userMessage').val();
        $.ajax({
            type: 'POST',
            url: 'chat.php',
            contentType: 'application/json',
            data: JSON.stringify({message: userMessage}),
            success: function(response) {
                $('#chatBox').append('<p><strong>사용자:</strong> ' + userMessage + '</p>');
                $('#chatBox').append('<p><strong>GPT:</strong> ' + response.response + '</p>');
                $('#userMessage').val('');
                saveMessage(userMessage, response.response);
            }
        });
    });

    $('#saveFtpInfoButton').click(function() {
        var ftpUsername = $('#ftpUsername').val();
        var ftpPassword = $('#ftpPassword').val();
        var dbPassword = $('#dbPassword').val();
        $.ajax({
            type: 'POST',
            url: 'save_ftp_info.php',
            contentType: 'application/json',
            data: JSON.stringify({
                ftpUsername: ftpUsername,
                ftpPassword: ftpPassword,
                dbPassword: dbPassword
            }),
            success: function(response) {
                var result = JSON.parse(response);
                if (result.status === 'success') {
                    alert('FTP 계정 정보가 성공적으로 저장되었습니다.');
                } else {
                    alert('FTP 계정 정보 저장에 실패했습니다: ' + result.message);
                }
            },
            error: function() {
                alert('FTP 계정 정보 저장 요청에 실패했습니다.');
            }
        });
    });

    $('#generateCodeButton').click(function() {
        var codeRequest = $('#codeRequest').val();
        $.ajax({
            type: 'POST',
            url: 'generate_code.php',
            contentType: 'application/json',
            data: JSON.stringify({codeRequest: codeRequest}),
            success: function(response) {
                var result = JSON.parse(response);
                if (result.status === 'success') {
                    alert('코드가 성공적으로 업로드되었습니다. 링크: ' + result.link);
                    $('#chatBox').append('<p><strong>링크:</strong> <a href="' + result.link + '" target="_blank">' + result.link + '</a></p>');
                } else {
                    alert('코드 업로드에 실패했습니다: ' + result.message);
                }
            },
            error: function() {
                alert('코드 요청에 실패했습니다.');
            }
        });
    });

    function saveMessage(userMessage, response) {
        $.ajax({
            type: 'POST',
            url: 'save_message.php',
            contentType: 'application/json',
            data: JSON.stringify({
                message: userMessage,
                response: response
            }),
            success: function(response) {
                console.log('Message saved successfully.');
            },
            error: function() {
                console.log('Failed to save message.');
            }
        });
    }
    
    // 파일 업로드 목록 불러오기
    function loadUploadedFiles() {
        $.ajax({
            type: 'GET',
            url: 'get_uploaded_files.php',
            success: function(response) {
                var files = response.files;
                var fileList = $('#fileList');
                fileList.empty();
                files.forEach(function(file) {
                    fileList.append('<li><a href="' + file.file_path + '" target="_blank">' + file.file_name + '</a></li>');
                });
            },
            error: function() {
                console.log('Failed to load uploaded files.');
            }
        });
    }
    
    loadUploadedFiles();
});
