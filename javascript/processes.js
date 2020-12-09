import { spawn, exec } from 'child_process';

exec("ls", (err, stdout, stdin) => {
	console.log(`out:\n ${stdout}`);
});

exec("grind list", (err, stdout, stdin) => {
	console.log(`out:\n ${stdout}`);
});

let url = "access_token=BQAVyCcSCzJjdb3JxDcGkhJSv8UVEkaUcWBTPEZ_R8p8wXzvHAQ1UzyF8ggwg8pg7FwozRrBiZ0u8hIEjdNW_9o-cXlffZwBf0UlK7rgTRNDhUOkOojhISBlHiHCGVDWIXwTzda_v-olBiO-mR4aqmDi066Sc8ZtRjJ8LAlVFelV9Do2wXQ&token_type=Bearer&expires_in=3600";

console.log(decodeURI(url));