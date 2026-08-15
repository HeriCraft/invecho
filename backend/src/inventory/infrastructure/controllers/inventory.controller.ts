import { Controller, Post, Param, Get, Inject, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CheckStockUseCase } from '../../application/use-cases/check-stock.use-case';
import { SyncErpStockUseCase } from '../../application/use-cases/sync-erp-stock.use-case';
import type { IInventoryRepository } from '../../domain/repositories/inventory.repository.interface';
import { IsString, IsNumber, Min } from 'class-validator';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

export class SyncStockDto {
  @ApiProperty({ description: "L'identifiant du produit", example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'La quantité à ajouter', example: 50 })
  @IsNumber()
  @Min(1)
  restockAmount: number;
}

export class ProductResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Produit A' })
  name: string;

  @ApiProperty({ example: 25 })
  stock: number;

  @ApiProperty({ example: 10 })
  threshold: number;
}

@ApiTags('Inventaire')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly checkStockUseCase: CheckStockUseCase,
    private readonly syncErpStockUseCase: SyncErpStockUseCase,
    @Inject('INVENTORY_REPOSITORY')
    private readonly repository: IInventoryRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les produits', description: 'Récupère la liste complète des produits et leur stock actuel.' })
  @ApiResponse({ status: 200, description: 'Liste des produits retournée avec succès.', type: [ProductResponseDto] })
  async getInventory() {
    const products = await this.repository.findAll();
    return products.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock.current,
      threshold: p.stock.threshold,
    }));
  }

  @Post(':id/check')
  @ApiOperation({ summary: "Vérifie le stock d'un produit", description: 'Déclenche une vérification de stock pour un produit donné.' })
  @ApiParam({ name: 'id', description: 'ID du produit', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 201, description: 'Vérification initiée.', schema: { example: { status: 'check initiated' } } })
  async checkStock(@Param('id') id: string) {
    await this.checkStockUseCase.execute(id);
    return { status: 'check initiated' };
  }

  @Post('sync')
  @ApiOperation({ summary: 'Synchronise le stock depuis ERP', description: 'Ajoute du stock pour un produit spécifique suite à un réassort.' })
  @ApiResponse({ status: 201, description: 'Stock synchronisé.', schema: { example: { status: 'stock synced' } } })
  async syncStock(@Body() dto: SyncStockDto) {
    await this.syncErpStockUseCase.execute(dto.productId, dto.restockAmount);
    return { status: 'stock synced' };
  }
}
