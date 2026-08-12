package com.sample.core.enums;

public enum TipoEnum {

	DELDIA("Dia"),
	EJECUTIVO("Ejecutivo"),
	ESTUDIANTIL("Estudiantil");

	private String tipo;
	
	 TipoEnum(String tipo) {
		this.tipo = tipo;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	
	public static TipoEnum obtenerTipo(String tipo){
		return TipoEnum.valueOf(tipo);
	}
}
