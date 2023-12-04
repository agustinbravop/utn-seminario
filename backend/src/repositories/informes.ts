import { PrismaClient } from "@prisma/client";
import { DiasDeSemanaPopularesQuery } from "../services/informes.js";
import { Dia } from "../models/disponibilidad.js";
import { getDiaDeSemana } from "../utils/dates.js";
import { HORARIOS } from "../utils/constants.js";

export interface InformeRepository {
  getDiasDeSemanaPopulares(
    query: DiasDeSemanaPopularesQuery
  ): Promise<Record<Dia, number>>;
  getHorariosPopulares(
    query: DiasDeSemanaPopularesQuery
  ): Promise<Record<string, number>>;
}

export class PrismaInformeRepository implements InformeRepository {
  private prisma: PrismaClient;
  private include = {
    disponibilidad: {
      include: {
        disciplina: true,
        dias: true,
        cancha: { include: { establecimiento: true } },
      },
    },
    pagoReserva: true,
    pagoSenia: true,
  };

  constructor(Prisma: PrismaClient) {
    this.prisma = Prisma;
  }

  async getDiasDeSemanaPopulares(query: DiasDeSemanaPopularesQuery) {
    const diasSemana: Record<string, number> = {
      Lunes: 0,
      Martes: 0,
      Miércoles: 0,
      Jueves: 0,
      Viernes: 0,
      Sábado: 0,
      Domingo: 0,
    };
    const reservas = await this.prisma.reserva.findMany({
      where: {
        disponibilidad: {
          cancha: { idEstablecimiento: query.idEst },
          horaInicio: { gte: query.horaInicio },
          horaFin: { lte: query.horaFin },
        },
      },
      include: this.include,
    });

    for (const res of reservas) {
      // Cada reserva realizada para un día de samana aumenta en uno ese día.
      const dia = getDiaDeSemana(res.fechaReservada);
      diasSemana[dia as Dia] += 1;
    }

    return diasSemana;
  }

  async getHorariosPopulares(query: DiasDeSemanaPopularesQuery) {
    const horarios: Record<string, number> = Object.fromEntries(
      HORARIOS.filter((h) => query.horaInicio <= h && h <= query.horaFin).map(
        (hora) => [hora, 0]
      )
    );
    const reservas = await this.prisma.reserva.findMany({
      where: {
        disponibilidad: {
          cancha: { idEstablecimiento: query.idEst },
          horaInicio: { gte: query.horaInicio },
          horaFin: { lte: query.horaFin },
        },
      },
      include: this.include,
    });

    for (const res of reservas) {
      this.acumularHorarios(
        horarios,
        res.disponibilidad.horaInicio,
        res.disponibilidad.horaFin
      );
    }

    return horarios;
  }

  /**
   * Incrementa en uno todos los `horarios` desde la `horaInicio` de la reserva
   * hasta la `horaFin`, que son los horarios en los cuales fue (o será) jugada.
   */
  private acumularHorarios(
    horarios: Record<string, number>,
    horaInicio: string,
    horaFin: string
  ) {
    for (const h of HORARIOS) {
      if (horaInicio <= h && h < horaFin) {
        horarios[h] += 1;
      }
    }
  }
}
