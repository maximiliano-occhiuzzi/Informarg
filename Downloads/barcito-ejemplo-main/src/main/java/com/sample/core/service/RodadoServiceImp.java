package com.sample.core.service;

import java.util.List;

import com.sample.core.domain.Rodado;
import com.sample.core.enums.CajaEnum;
import com.sample.core.enums.MotorEnum;
import com.sample.core.enums.PuertasEnum;
import com.sample.core.enums.TipoConsumoEnum;
import com.sample.core.enums.TipoEstadoEnum;
import com.sample.core.enums.TipoRodadoEnum;
import com.sample.core.dao.RodadoDao;
import com.sample.core.dao.RodadoDaoImp;

public class RodadoServiceImp implements RodadoService {
	private RodadoDao RodadoDao = new RodadoDaoImp();

	public void crearRodado(String patente, String chasis, String color, CajaEnum caja, MotorEnum motor,
			TipoEstadoEnum TipoEstado, TipoConsumoEnum TipoConsumo, PuertasEnum puertas, TipoRodadoEnum TipoRodado)
			throws Exception {
		RodadoDao.crearRodado(new Rodado(patente, caja,chasis, 
				motor, TipoEstado, color, TipoConsumo, puertas, null, TipoRodado));
		
	}

	@Override
	public void LeerRodado(String patente, String chasis, String color, CajaEnum caja, MotorEnum motor,
			TipoEstadoEnum TipoEstado, TipoConsumoEnum TipoConsumo, PuertasEnum puertas, TipoRodadoEnum TipoRodado)
			throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public List<Rodado> listarRodado() throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

}
