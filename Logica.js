window.onload = ()=>{
	/*
	Sarmiento Gutierrez Juan Carlos
	*/
	let Ecuaciones = new Array();

	document.getElementById('formSistema').onsubmit = (e)=>{
		e.preventDefault();
		const NumeroEcuaciones = document.getElementById('numeroecuacion').value;
		const NumeroVariables = document.getElementById('numerovariables').value;
		Ecuaciones=[];	
		GeneraSistema(NumeroEcuaciones,NumeroVariables);
	}

	document.getElementById('contenido').onsubmit = (e)=>{
		e.preventDefault();
		const NumeroEcuaciones = document.getElementById('numeroecuacion').value;
		const NumeroVariables = document.getElementById('numerovariables').value;
		const ValoresEcuaciones = ObtenerValores(Ecuaciones,NumeroEcuaciones,NumeroVariables);

		const MatrizDiagonalizada = AlgoritmoFilaCero(ValoresEcuaciones);
		console.log(MatrizDiagonalizada);	

		if (TipoSolucion(MatrizDiagonalizada)==2) {
			let infinity = ['El sistema no tiene solucion'];
			MostarSoluciones(infinity,0);
		}else if (TipoSolucion(MatrizDiagonalizada)==1) {
			let infinity = ['El sistema tiene una infinidad de soluciones'];
			MostarSoluciones(infinity,0);
		}else{
			const MatrizDInvertida = InvertirMatriz(MatrizDiagonalizada);
			console.log(MatrizDInvertida);

			const MatrizFinal = AlgoritmoFilaCero(MatrizDInvertida);
			console.log(MatrizFinal);

			const MatrizFinalInvertida = InvertirMatriz(MatrizFinal);
			console.log(MatrizFinalInvertida);

			const Sol = GenerarSoluciones(MatrizFinalInvertida);
			console.log(Sol);
			MostarSoluciones(Sol,1);
		}
	}

	const GeneraSistema = (ecuaciones,variables) => {
		const contenedor = document.getElementById('contenido');
		const contenedorSolucion = document.getElementById('solutions');
		contenedorSolucion.innerHTML='';
		contenedor.innerHTML='';
		for (let i = 0; i < ecuaciones ; i++) {
			for (let j = 0; j < variables ; j++) {
				if (j == variables-1) {
					contenedor.innerHTML+= `<input type="number" required id="a${i+1}${j+1}" step="any" style="width : 50px; heigth : 20px"><label for="a${i+1}${j+1}">X<h8>${j+1}</h8> = </label><input type="number" required id="b${i+1}${j+1}" step="any" style="width : 50px; heigth : 20px"><br>`;
				}else{
					contenedor.innerHTML+= `<input type="number" required id="a${i+1}${j+1}" step="any" style="width : 50px; heigth : 20px"><label for="a${i+1}${j+1}">X<h8>${j+1}</h8> + </label>`;
				}
			}
		}
		contenedor.innerHTML+= `<div class="form-row"><div class="col"><input type="submit" value="Resolver Sistema de Ecuaciones" class="btn btn-warning"></div></div>`;
	}

	const ObtenerValores = (ArregloEcuaciones,ecuaciones,variables)=>{
		let arreglo = new Array();
		ArregloEcuaciones = [];
		for (let i = 0; i < ecuaciones; i++) {
			arreglo=[];
			for (let j = 0; j < variables; j++) {
				if (j == variables-1) {
					arreglo.push(document.getElementById(`a${i+1}${j+1}`).value);
					arreglo.push(document.getElementById(`b${i+1}${j+1}`).value);
				}else{
					arreglo.push(document.getElementById(`a${i+1}${j+1}`).value);
				}
			}
			ArregloEcuaciones.push(arreglo);
		}
		return ArregloEcuaciones;
	}

	const AlgoritmoFilaCero = (arregloEcuaciones) => {
		let ec1Helper = [];
		let ec2Helper = [];
		let newEcuaciones = arregloEcuaciones;
		let iteracionFactor=0;
		let arrayCambiaFila;
		for (let i = 0; i < newEcuaciones.length-1; i++) {
			const fila = newEcuaciones[i];
			for (let j = i; j < newEcuaciones.length-1; j++) {
				const filaSig = newEcuaciones[j+1];
				ec1Helper = fila.map(x => x*filaSig[iteracionFactor]);
				ec2Helper = filaSig.map(x => x*(-fila[iteracionFactor]));
				arrayCambiaFila = [];
				for (let k = 0; k < newEcuaciones[0].length; k++) {
					let result = ec1Helper[k] + ec2Helper[k];
					arrayCambiaFila.push(result);
				}
				newEcuaciones[j+1]=arrayCambiaFila;
			}
			iteracionFactor++;
		}
		return newEcuaciones;
	};

	const InvertirMatriz = (MatrizDiagonalizada) => {
		const nVariables =  MatrizDiagonalizada[0].length;
		let MatrizAyuda = [];
		let CambioFila = [];
		let CambioFilaInvertido = [];
		let counter = 0;
		for (let i = MatrizDiagonalizada.length; i > 0; i--) {
			CambioFila = MatrizDiagonalizada[i-1];
			CambioFilaInvertido = [];
			for (let j = 0; j < nVariables-1; j++) {
				let valorMatrizOriginal = CambioFila[(nVariables-2)-j];
				CambioFilaInvertido.push(valorMatrizOriginal);
				if (j+1==nVariables-1) {
					CambioFilaInvertido.push(CambioFila[nVariables-1]);
				}
			}
			MatrizAyuda[counter] = CambioFilaInvertido;
			counter++;
		}
		return MatrizAyuda;
	}

	const GenerarSoluciones = (MatrizFinal) => {
		let Soluciones = new Array();
		let Errores = new Array();
		const nVariables =  MatrizFinal[0].length;
		for (let i = 0; i < MatrizFinal.length ; i++) {
			const Numerador = (MatrizFinal[i][nVariables-1]);
			const Denominador = (MatrizFinal[i][i]);
			const sol = (Numerador/Denominador);
			if (Denominador == 0 && Numerador == 0) {
				Errores.push('El sistema tiene soluciones infinitas');
				return Errores;
			}else{
				Soluciones.push(sol);
			}
		}
		return Soluciones;
	}

	const TipoSolucion = (Matriz) => {
		const nVariables =  Matriz[0].length;
		let RangoA = 0;
		let Rangoa = 0;
		//Para la matriz A*
		for (let i = 0; i < Matriz.length ; i++) {
			for (let j = 0; j < nVariables; j++) {
				let aumento = j;
				if (Matriz[i][aumento]!=0) {
					RangoA++;
					break;
				}
			}
		}
		//Para la matriz A
		for (let i = 0; i < Matriz.length ; i++) {
			for (let j = 0; j < nVariables-1; j++) {
				let aumento = j;
				if (Matriz[i][aumento]!=0) {
					Rangoa++;
					break;
				}
			}
		}
		if (Rangoa!=RangoA) {return 2;}
		if (Rangoa==RangoA && RangoA<nVariables-1) {return 1;}
		if (Rangoa==nVariables-1 && RangoA==nVariables-1) {return 0;}
	}

	const MostarSoluciones = (Soluciones,TipoSolucion)=>{
		const contenedorSolucion = document.getElementById('solutions');
		contenedorSolucion.innerHTML = '<h6>Las Soluciones al Sistema son: </h6><br>';
		if (TipoSolucion==0) {
			contenedorSolucion.innerHTML+= `<h6>${Soluciones[0]}</h6>`;
		}else{
			for (let i = 0; i < Soluciones.length ; i++) {
			contenedorSolucion.innerHTML+= `<h6>X${i+1} = ${Soluciones[i]}</h6><br>`;
			}
		}
	}
}