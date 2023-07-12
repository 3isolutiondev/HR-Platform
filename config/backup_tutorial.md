1. pastikan dump_binary_path sudah di setting di database, tujuannya ke lokasi mysqldump, bisa cek menggunakan which mysqldump
2. setting cronjob di kernel,
3. setting crontab 
- env EDITOR=vim crontab -e
- paste code di bawah
#!/bin/sh
PATH=/usr/local/bin:/usr/local/sbin:~/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/XAMPP/xamppfiles/bin/

* * * * * cd '/Users/immap/Immap/HR-Roster' && php artisan schedule:run >> /dev/null 2>&1

- crontab -l 



