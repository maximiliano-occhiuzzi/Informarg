package com.sample.core.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.sample.core.dao.config.Conexion;
import com.sample.core.domain.Rodado;
import com.sample.core.enums.CajaEnum;
import com.sample.core.enums.MotorEnum;
import com.sample.core.enums.PuertasEnum;
import com.sample.core.enums.TipoConsumoEnum;
import com.sample.core.enums.TipoEstadoEnum;
import com.sample.core.enums.TipoRodadoEnum;

public class RodadoDaoImp implements RodadoDao {

	private static final String queryConsultarBebida = "SELECT id, Precio, Descripcion FROM Rodado where id=?";

	private static final String queryAddBebida = "INSERT INTO Rodado ( titulo, descripcion, precio) VALUES (?,?,?)";

	private static final String queryDeleteBebida = "DELETE FROM Rodado WHERE id=?";

	private static final String queryList = "SELECT id, titulo, descripcion, precio FROM Rodado";

	private Conexion conexion = Conexion.getInstance();

	@Override
	public Rodado findByPatente(String patente) throws Exception {
		return null;
	}

	@Override
	public List<Rodado> list() throws Exception {
		return null;
	}

	@Override
	public void save(Rodado rodado) throws Exception {

	}

	@Override
	public void delete(String patente) throws Exception {

	}

	@Override
	public void crearRodado(Rodado rodado) throws Exception {
		Statement st = null;
		ResultSet rs = null;
		try {
			st = conexion.dameConnection().createStatement();
			int result = st.executeUpdate(
					"INSERT INTO rodado (patente, chasis, color, caja, motor, tipo_estado, tipo_consumo, puertas, tipo_rodado) VALUES "
							+ "('" + rodado.getPatente() + "', " + "'" + rodado.getChasis() + "', " + "'"
							+ rodado.getColor() + "', " + "'" + rodado.getCaja().name() + "', " + "'"
							+ rodado.getMotor().name() + "', " + "'" + rodado.getTipoEstado().name() + "', " + "'"
							+ rodado.getTipoConsumo().name() + "', " + "'" + rodado.getPuertas().name() + "', " + "'"
							+ rodado.getTipoRodado().name() + "')");
			if (result == 0) {
				throw new Exception("No se inserto el registro");
			}

		} catch (Exception e) {
			throw new Exception(e.getMessage());
		} finally {
			finalizarConexion(st,rs);
		}

	}

	private void finalizarConexion(Statement st, ResultSet rs) {
	    try {
	        if (st != null) {
	            st.close();
	        }
	        if (rs != null) { // Esta validación evita el NullPointerException
	            rs.close();
	        }
	    } catch (SQLException e) {
	        System.out.println("Error al cerrar recursos: " + e.getMessage());
	    }
	}
}
