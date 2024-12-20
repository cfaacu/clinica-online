import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPaciente',
  standalone: true
})
export class FilterPacientePipe implements PipeTransform {

  transform(lista: any, arg: any): any {
    const resultPosts = [];
    if (arg != null) {
      for (const post of lista) {
        if (
          post.especialidad.nombre.toLowerCase().indexOf(arg) > -1 ||
          post.especialista.nombre.toLowerCase().indexOf(arg) > -1 ||
          post.especialista.apellido.toLowerCase().indexOf(arg) > -1 ||
          (post.historiaClinica != '' &&
            (post.historiaClinica.altura.toString().indexOf(arg) > -1 ||
              post.historiaClinica.peso.toString().indexOf(arg) > -1 ||
              post.historiaClinica.temperatura.toString().indexOf(arg) > -1 ||
              post.historiaClinica.presion.toLowerCase().indexOf(arg) > -1 ||
              post.historiaClinica.clave1?.toLowerCase().indexOf(arg) > -1 ||
              post.historiaClinica.clave3?.toLowerCase().indexOf(arg) > -1 ||
              post.historiaClinica.clave2?.toLowerCase().indexOf(arg) > -1 ||
              post.historiaClinica.valor1?.toLowerCase().indexOf(arg) > -1 ||
              post.historiaClinica.valor2?.toLowerCase().indexOf(arg) > -1 ||
              post.historiaClinica.valor3?.toLowerCase().indexOf(arg) > -1))
        ) {
          resultPosts.push(post);
        }
      }
      return resultPosts;
    } else {
      return lista;
    }
  }

}
