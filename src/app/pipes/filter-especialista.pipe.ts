import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEspecialista',
  standalone: true
})
export class FilterEspecialistaPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    if (arg != null) {
      for (const post of value) {
        if (
          (post.especialidad?.descripcion?.toLowerCase().indexOf(arg) > -1) ||
          (post.paciente?.nombre?.toLowerCase().indexOf(arg) > -1) ||
          (post.paciente?.apellido?.toLowerCase().indexOf(arg) > -1) ||
          (post.historiaClinica && post.historiaClinica !== '' && (
            (post.historiaClinica.altura?.toString().indexOf(arg) > -1) ||
            (post.historiaClinica.peso?.toString().indexOf(arg) > -1) ||
            (post.historiaClinica.temperatura?.toString().indexOf(arg) > -1) ||
            (post.historiaClinica.presion.indexOf(arg) > -1) ||
            (post.historiaClinica.clave1?.toLowerCase().indexOf(arg) > -1) ||
            (post.historiaClinica.clave3?.toLowerCase().indexOf(arg) > -1) ||
            (post.historiaClinica.clave2?.toLowerCase().indexOf(arg) > -1) ||
            (post.historiaClinica.valor1?.toLowerCase().indexOf(arg) > -1) ||
            (post.historiaClinica.valor2?.toLowerCase().indexOf(arg) > -1) ||
            (post.historiaClinica.valor3?.toLowerCase().indexOf(arg) > -1)
          ))
        ) {
          resultPosts.push(post);
        }
      }
      return resultPosts;
    } else {
      return value;
    }
  }

}
