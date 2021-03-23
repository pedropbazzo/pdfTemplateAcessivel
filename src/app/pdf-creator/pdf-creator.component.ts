import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import html2pdf from 'html2pdf.js';
import { PdfPageComponent } from '../pdf-page/pdf-page.component';

@Component({
  selector: 'app-pdf-creator',
  templateUrl: './pdf-creator.component.html',
  styleUrls: ['./pdf-creator.component.scss']
})
export class PdfCreatorComponent implements OnInit {

  @ViewChild('priceListPDF', { static: true, read: ViewContainerRef }) priceListPDF: ViewContainerRef;

  priceList: {name: string, image: string, brand: string, price: number, checked: boolean}[] = [
    
  ];

  constructor(
    private readonly resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit(): void { }

  selectItems(): void {
    const title = 'Preço dos carros para 2021';

    this.createPDF(title, this.priceList.filter(car => car.checked));
  }

  private createPDF(title: string, priceList: {name: string, image: string, brand: string, price: number, checked: boolean}[]): void {
    this.priceListPDF.clear();
    const factory = this.resolver.resolveComponentFactory(PdfPageComponent);
    const componentRef = this.priceListPDF.createComponent(factory);

    componentRef.instance.title = title;
    componentRef.instance.priceList = priceList;

    componentRef.instance.emitter.subscribe(() => {
      const config = {
        html2canvas: {
          scale: 1,
          scrollX: 0,
          scrollY: 0,
        },
      };

      this.print(componentRef.location.nativeElement, config);
      componentRef.destroy();
    });
  }

  private print(content: any, config: any): void {
    html2pdf()
      .set(config)
      .from(content)
      .toPdf()
      .outputPdf('dataurlnewwindow');
  }
}
