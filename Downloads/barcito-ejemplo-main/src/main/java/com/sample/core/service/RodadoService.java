package com.sample.core.service;

import java.util.List;

import com.sample.core.domain.Rodado;
import com.sample.core.enums.CajaEnum;
import com.sample.core.enums.MotorEnum;
import com.sample.core.enums.PuertasEnum;
import com.sample.core.enums.TipoConsumoEnum;
import com.sample.core.enums.TipoEstadoEnum;
import com.sample.core.enums.TipoRodadoEnum;

public interface RodadoService {

	public List<Rodado> listarRodado() throws Exception;


	public void crearRodado(String patente, String chasis, String color, CajaEnum caja, MotorEnum motor,
			TipoEstadoEnum TipoEstado, TipoConsumoEnum TipoConsumo, PuertasEnum puertas, TipoRodadoEnum TipoRodado)
			throws Exception;


	public void LeerRodado(String patente, String chasis, String color, CajaEnum caja, MotorEnum motor,
			TipoEstadoEnum TipoEstado, TipoConsumoEnum TipoConsumo, PuertasEnum puertas, TipoRodadoEnum TipoRodado)
			throws Exception;

}
