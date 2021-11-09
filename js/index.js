
const firebaseConfig = {
    apiKey: "AIzaSyBJloUjXKKz-W226a0r9ldiVtDB-jiS_Dg",
    authDomain: "matricula-estudiantes.firebaseapp.com",
    databaseURL: "https://matricula-estudiantes-default-rtdb.firebaseio.com",
    projectId: "matricula-estudiantes",
    storageBucket: "matricula-estudiantes.appspot.com",
    messagingSenderId: "932027543692",
    appId: "1:932027543692:web:7e144f78c69a60d3ba4ba9",
    measurementId: "G-WBYC1HDCHS"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

function matricularEstudiante(){
    const nombre = document.getElementById("nombreEstudiante").value;
    const curso = document.getElementById("cursoEstudiante").value;
    const codigo = document.getElementById("codigoEstudiante").value;

    if(nombre && codigo && curso) {
        const estudiante = {
            nombre: nombre,
            curso: curso,
            codigo: codigo,
            puntaje: 0
        }

        database.ref('students/').push().set(estudiante);
        alert('Estudiante matriculado existosamente');
        clearFields();
        window.location.reload()
    } else {
        alert("Por favor complete todos los campos");
    }

}

function cargarDatos() {
    const sinBonoContainer = document.getElementById('sinBonoContainer');
    const bonoPlataContainer = document.getElementById('bonoPlataContainer');
    const bonoOroContainer = document.getElementById('bonoOroContainer');

    database.ref('students').on('value', function(data) {
        data.forEach(
            function(estudiante) {
                const datosEstudiante = estudiante.val();
                const card = new EstudianteCard(datosEstudiante, estudiante.key);
                if (datosEstudiante.puntaje < 5) {
                    sinBonoContainer.appendChild(card.render());
                } else if (datosEstudiante.puntaje > 10) {
                    bonoOroContainer.appendChild(card.render());
                } else {
                    bonoPlataContainer.appendChild(card.render());
                }
            }
        )
    })
}

function clearFields() {
    document.getElementById("nombreEstudiante").value = '';
    document.getElementById("cursoEstudiante").value = '';
    document.getElementById("codigoEstudiante").value = '';
}

function eliminarEstudiante(estudianteId) {
    database.ref(`students/${estudianteId}`).set(null);

    alert("Estudiante eliminado correctamente");
    window.location.reload()
}

function agregarPuntos(estudianteId) {
   const data =  database.ref(`students/${estudianteId}`).once('value', function (data) {
       const nuevoPuntaje = data.val().puntaje + 1;
       const nuevosDatos = {...data.val(), ...{puntaje: nuevoPuntaje}};
       database.ref(`students/${estudianteId}`).set(nuevosDatos);
       alert(`Nuevo puntaje ${nuevoPuntaje}`);
       window.location.reload()
   });
}


class EstudianteCard {
    constructor(estudiante, id) {
        this.estudiante = estudiante;
        this.id = id;
    }

    render = () => {
        const component = document.createElement('div');

        component.innerHTML = (
            `<div class="card card-list">
             <div class="card-container">
             <div class="row">
             <div class="col">
               <p style="color:#808080">${this.estudiante.curso}</p>
               <p>${this.estudiante.nombre}</p>
               <p>${this.estudiante.codigo}</p>
               <p>${this.estudiante.puntaje}</p>
                </div>
            <div class="col">
                <button value=${this.id} onclick="eliminarEstudiante(this.value)" class="button roundRedButton">x</button> 
                <button value=${this.id} onclick="agregarPuntos(this.value)" class="button roundBlueButton">+</button> 

                </div>
               </div>
            
            </div>
            </div>`
        )

        return component;
    }
}
