package com.sample.core.dao;
import java.util.List;
import com.sample.core.domain.Rodado;
import com.sample.core.enums.CajaEnum;
import com.sample.core.enums.MotorEnum;
import com.sample.core.enums.PuertasEnum;
import com.sample.core.enums.TipoConsumoEnum;
import com.sample.core.enums.TipoEstadoEnum;
import com.sample.core.enums.TipoRodadoEnum;


public interface RodadoDao {

	public Rodado findByPatente(String patente) throws Exception;
	
	public List<Rodado> list() throws Exception;

	public void crearRodado(Rodado rodado) throws Exception;

	public void save(Rodado rodado) throws Exception;

	public void delete(String patente) throws Exception;
}
