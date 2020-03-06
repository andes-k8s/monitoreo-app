import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sexo', pure: false })

export class SexoPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        let result: string;
        const sexo = value && value.sexo && (value.sexo.nombre || value.sexo);
        const genero = value && value.genero && (value.genero.nombre || value.genero);

        if (!genero) {
            result = sexo;
        } else {
            if (genero.toUpperCase() === sexo.toUpperCase()) {
                result = sexo;
            } else {
                result = genero + ' (autopercibido)';
            }
        }
        if (result) {
            return result.charAt(0).toUpperCase() + result.substr(1).toLowerCase();
        } else {
            return null;
        }
    }
}
