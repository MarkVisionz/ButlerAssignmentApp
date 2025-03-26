const Assignment = require('../models/Assignment');
const xml2js = require('xml2js');

exports.processXML = async (req, res) => {
    try {
        const xmlString = req.file.buffer.toString();
        const parser = new xml2js.Parser();

        parser.parseString(xmlString, async (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Error parsing XML' });
            }

            if (!result.RES_DETAIL?.LIST_G_GROUP_BY1?.[0]?.G_GROUP_BY1?.[0]?.LIST_G_RESERVATION?.[0]?.G_RESERVATION) {
                return res.status(400).json({ message: 'Invalid XML structure' });
            }

            const reservations = result.RES_DETAIL.LIST_G_GROUP_BY1[0].G_GROUP_BY1[0].LIST_G_RESERVATION[0].G_RESERVATION;

            const validRoomTypes = ["PK1N", "PQ2N", "HK1N", "HQ2N", "OK1N", "OQ2N", "BK1N", "AQ2N", "MK1N", "NK1N", "TKN", "UKN", "VKN", "ZKN"];
            const butlerPairs = ["Marko/Ali", "Edgar/Joyce", "Miguel/Rodrigo", "Sofia/Fernando", "Daniel/Lemus", "Jhovany/Marlon"];

            const assignments = reservations
                .map(reservation => {
                    const roomType = reservation.ROOM_CATEGORY_LABEL?.[0] || null;
                    if (!validRoomTypes.includes(roomType)) return null; // Filtrar por tipos de habitación válidos

                    return {
                        name: reservation.FULL_NAME?.[0] || "Unknown Guest",
                        roomType,
                        roomNo: reservation.ROOM_NO?.[0] || "Unknown",
                        rateAmount: parseFloat(reservation.EFFECTIVE_RATE_AMOUNT?.[0]) || 0,
                        assignedButler: null, // Se asignará después
                        begin_date: reservation.ARRIVAL?.[0] || null, // Tomamos directamente el valor de ARRIVAL
                        departure_date: reservation.DEPARTURE?.[0] || null // Tomamos directamente el valor de DEPARTURE
                    };
                })
                .filter(room => room !== null); // Remover habitaciones inválidas

            // **Evitar duplicados en MongoDB**
            for (let i = 0; i < assignments.length; i++) {
                assignments[i].assignedButler = butlerPairs[i % butlerPairs.length];
            }

            for (const assignment of assignments) {
                await Assignment.findOneAndUpdate(
                    { name: assignment.name, roomNo: assignment.roomNo }, // Evita duplicar la misma asignación
                    assignment,
                    { upsert: true, new: true }
                );
            }

            res.json({ message: 'XML processed successfully', assignments });
        });

    } catch (error) {
        console.error("Error processing XML:", error);
        res.status(500).json({ message: 'Error processing XML' });
    }
};
