window.onload = function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const all_fields = document.querySelectorAll('input');
        let deny_submit = 0;
        for (field of all_fields) {
            if (isRequired(field)) {
                const fieldHelp = document.getElementById(`${field.id}_help`);
                if (fieldHelp !== null) fieldHelp.remove();
                if (field.value === '') {
                    const help = document.createElement('small');
                    help.id = `${field.id}_help`;
                    help.className = 'text text-danger';
                    help.innerHTML = 'Este campo é obrigatório!';
                    field.parentNode.insertBefore(help, field.nextSibling);
                    deny_submit = 1;
                }
            }
        }
        if (deny_submit === 0) form.submit();
    });
    
    function isRequired(field) {
        const required_fields = ['name', 'username', 'email', 'birthdate', 'phone', 'password'];
        if (required_fields.includes(field.name)) return true;
    };
};