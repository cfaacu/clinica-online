import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTurnos',
  standalone: true
})
export class FilterTurnosPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];

    if (arg != null) {
      for (const post of value) {
        if (
          post.especialidad.descripcion.toLowerCase().indexOf(arg) > -1 ||
          post.especialista.nombre.toLowerCase().indexOf(arg) > -1 ||
          post.especialista.apellido.toLowerCase().indexOf(arg) > -1 ||
          post.paciente.nombre.toLowerCase().indexOf(arg) > -1 ||
          post.paciente.apellido.toLowerCase().indexOf(arg) > -1 ||
          post.historiaClinica.altura.indexOf(arg) > -1 ||
          post.historiaClinica.peso.indexOf(arg) > -1 ||
          post.historiaClinica.temperatura.toString().indexOf(arg) > -1 ||
          post.historiaClinica.presion.indexOf(arg) > -1 ||
          post.historiaClinica.valor1.toLowerCase().indexOf(arg) > -1 ||
          post.historiaClinica.valor2.indexOf(arg) > -1 ||
          post.historiaClinica.valor3.indexOf(arg) > -1 ||
          post.historiaClinica.clave1.indexOf(arg) > -1 ||
          post.historiaClinica.clave3.indexOf(arg) > -1 ||
          post.historiaClinica.clave2.indexOf(arg) > -1 
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
