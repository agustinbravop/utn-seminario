import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Cancha, Establecimiento } from "@/models";
import { getCanchaByID } from "@/utils/api/canchas";
import { getEstablecimientoByID } from "@/utils/api/establecimientos";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { BreadcrumbLink, Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";

export default function Breadscrumb() {
    const { idEst, idCancha, idAdmin } = useParams();
    const { currentAdmin } = useCurrentAdmin();
    const {
        data: establecimientoData,
    } = useQuery<Establecimiento>(["establecimiento", idEst], () =>
        getEstablecimientoByID(Number(idEst))
    );
    const { data: canchaData } = useQuery<Cancha>(["canchas", idCancha], () =>
        getCanchaByID(Number(idEst), Number(idCancha))
    );
    const location = useLocation()
    let actualLink = ''

    const crumbs = location.pathname.split('/')
        .filter((crumb) => crumb !== "")
        .map((crumb) => {
            actualLink += `/${crumb}`

            return actualLink === '/ests' || actualLink === '/admin' ? null :
                actualLink === `/admin/${currentAdmin?.id}/perfil` ?
                    <BreadcrumbItem key={actualLink}>
                        <BreadcrumbLink href={actualLink}> Perfil </BreadcrumbLink>
                    </BreadcrumbItem> :
                    actualLink === `/ests/${crumb}` ?
                        <BreadcrumbItem key={actualLink}>
                            <BreadcrumbLink href={actualLink}> {establecimientoData?.nombre} </BreadcrumbLink>
                        </BreadcrumbItem> :
                        actualLink === `/ests/${idEst}/canchas/${canchaData?.id}` ?
                            <BreadcrumbItem key={actualLink}>
                                <BreadcrumbLink href={actualLink}> {canchaData?.nombre} </BreadcrumbLink>
                            </BreadcrumbItem> :
                            actualLink === `/admin/${currentAdmin?.id}` && actualLink === location.pathname ?
                                <BreadcrumbItem key={actualLink}>
                                    <BreadcrumbLink href={actualLink}> Home </BreadcrumbLink>
                                </BreadcrumbItem> :
                                (crumb === idAdmin.toString()) ? null :
                                    <BreadcrumbItem key={actualLink}>
                                        <BreadcrumbLink href={actualLink}> {(crumb.charAt(0).toUpperCase() + crumb.slice(1)).replace(/([a-z])([A-Z])/g, '$1 $2')} </BreadcrumbLink>
                                    </BreadcrumbItem>
                                ;
        })
    return (
        <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            {crumbs}
        </Breadcrumb>
    );
}