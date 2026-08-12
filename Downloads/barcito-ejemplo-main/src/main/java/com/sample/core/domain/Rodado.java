package com.sample.core.domain;

import com.sample.core.enums.BaulEnum;
import com.sample.core.enums.CajaEnum;
import com.sample.core.enums.MotorEnum;
import com.sample.core.enums.PuertasEnum;
import com.sample.core.enums.TipoConsumoEnum;
import com.sample.core.enums.TipoEstadoEnum;
import com.sample.core.enums.TipoRodadoEnum;

public class Rodado {

	private String patente;
	private CajaEnum caja;
	private String chasis;
	private MotorEnum motor;
	private TipoEstadoEnum tipoEstado;
	private String color;
	private TipoConsumoEnum TipoConsumo;
	private PuertasEnum puertas;
	private BaulEnum baul;
	private TipoRodadoEnum TipoRodado;

	
	
	public Rodado() {
		super();
	}

	

	public Rodado(String patente, CajaEnum caja, String chasis, MotorEnum motor, TipoEstadoEnum tipoEstado,
			String color, TipoConsumoEnum tipoConsumo, PuertasEnum puertas, BaulEnum baul, TipoRodadoEnum tipoRodado) {
		super();
		this.patente = patente;
		this.caja = caja;
		this.chasis = chasis;
		this.motor = motor;
		this.tipoEstado = tipoEstado;
		this.color = color;
		this.TipoConsumo = tipoConsumo;
		this.puertas = puertas;
		this.baul = baul;
		this.TipoRodado = tipoRodado;
	}



	public String getPatente() {
		return patente;
	}

	public void setPatente(String patente) {
		this.patente = patente;
	}

	public CajaEnum getCaja() {
		return caja;
	}

	public void setCaja(CajaEnum cajaEnum) {
		this.caja = cajaEnum;
	}

	public String getChasis() {
		return chasis;
	}

	public void setChasis(String chasis) {
		this.chasis = chasis;
	}

	public MotorEnum getMotor() {
		return motor;
	}

	public void setMotor(MotorEnum motor) {
		this.motor = motor;
	}

	public TipoEstadoEnum getTipoEstado() {
		return tipoEstado;
	}

	public void setTipoEstado(TipoEstadoEnum tipoEstado) {
		this.tipoEstado = tipoEstado;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public TipoConsumoEnum getTipoConsumo() {
		return TipoConsumo;
	}

	public void setTipoConsumo(TipoConsumoEnum tipoConsumo) {
		TipoConsumo = tipoConsumo;
	}

	public PuertasEnum getPuertas() {
		return puertas;
	}

	public void setPuertas(PuertasEnum puertas) {
		this.puertas = puertas;
	}

	public BaulEnum getBaul() {
		return baul;
	}

	public void setBaul(BaulEnum baul) {
		this.baul = baul;
	}

	public TipoRodadoEnum getTipoRodado() {
		return TipoRodado;
	}

	public void setTipoRodado(TipoRodadoEnum tipoRodado) {
		TipoRodado = tipoRodado;
	}



}
